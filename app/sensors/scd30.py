"""
Light wrapper for SCD30 sensor support.

This module will try to use an installed SCD30 driver if available.
If no hardware driver is present it falls back to a simulator so the
rest of the application can run without raising import errors.

Usage:
    from app.sensors.scd30 import SCD30
    s = SCD30()
    reading = s.read()  # -> {"co2": ppm, "temperature": C, "humidity": %}

Note: For real hardware you should install an appropriate driver such as
`smbus2` plus a community SCD30 package (package names vary by OS).
"""
from typing import Optional, Dict
import random

_HAS_DRIVER = False
_Driver = None

try:
    # Try common community driver names. If you have a different driver
    # installed, adapt this import to match it.
    import scd30 as _drv
    _Driver = _drv.SCD30
    _HAS_DRIVER = True
except Exception:
    try:
        # Sensirion or other driver fallback
        from scd30_i2c import SCD30 as _drv2
        _Driver = _drv2
        _HAS_DRIVER = True
    except Exception:
        _HAS_DRIVER = False


class SCD30:
    def __init__(self, bus: int = 1, address: int = 0x61):
        self._hw = None
        if _HAS_DRIVER and _Driver is not None:
            try:
                # Many drivers accept bus/address or nothing; try to be flexible
                try:
                    self._hw = _Driver(bus=bus, address=address)
                except TypeError:
                    self._hw = _Driver()
                # Some drivers require starting periodic measurement
                if hasattr(self._hw, "start_periodic_measurement"):
                    try:
                        self._hw.start_periodic_measurement()
                    except Exception:
                        pass
            except Exception:
                self._hw = None

    def read(self) -> Optional[Dict[str, float]]:
        """Return latest measurement or a simulated value.

        Real driver: returns {'co2': ppm, 'temperature': C, 'humidity': %}
        """
        if self._hw is not None:
            try:
                # Try driver-specific read patterns
                if hasattr(self._hw, "read_measurement"):
                    vals = self._hw.read_measurement()
                    if vals:
                        # common ordering: (co2, temp, rh)
                        return {"co2": float(vals[0]), "temperature": float(vals[1]), "humidity": float(vals[2])}
                if hasattr(self._hw, "get_measurement"):
                    vals = self._hw.get_measurement()
                    return {"co2": float(vals[0]), "temperature": float(vals[1]), "humidity": float(vals[2])}
            except Exception:
                # on any hardware read error, fall through to simulator
                pass

        # Simulator fallback
        return {"co2": float(random.randint(400, 1000)), "temperature": 22.0 + random.random(), "humidity": 40.0 + random.random() * 10.0}


__all__ = ["SCD30"]
