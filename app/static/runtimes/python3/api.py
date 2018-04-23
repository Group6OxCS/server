import json
import browser

NO_DETECTION = 10000

class Car:
    def __init__(self, data):
        self._steering = 0.0
        self._acceleration = 0.0
        self._brake = 0.0
        self._nitro = 0.0
        self._message = ""
        for key, value in json.loads(data).items():
            if key == "obstacle_detection_rays":
                self.obstacle_detection_rays = {odr["bearing"]: odr["distance"] for odr in value}
            else:
                setattr(self, key, value)

    @property
    def steering(self):
        return self._steering

    @steering.setter
    def steering(self, value):
        self._steering = float(value)
        return value

    @property
    def acceleration(self):
        return self._acceleration

    @acceleration.setter
    def acceleration(self, value):
        self._acceleration = float(value)
        return value

    @property
    def brake(self):
        return self._brake

    @brake.setter
    def brake(self, value):
        self._brake = float(value)
        return value

    @property
    def nitro(self):
        return self._nitro

    @nitro.setter
    def nitro(self, value):
        self._nitro = float(value)
        return value

    @property
    def message(self):
        return self._message

    @message.setter
    def message(self, value):
        self._message = float(value)
        return value

    def serialize(self):
        return json.dumps({
            "steering": self.steering,
            "acceleration": self.acceleration,
            "brake": self.brake,
            "nitro": self.nitro,
            "message": self.message
        })


captured_control = None


def verify():
    assert callable(captured_control)


def call_control(data):
    car = Car(data)
    captured_control(car)
    return car.serialize()


browser.window.verify = verify
browser.window.call_control = call_control
