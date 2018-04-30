import json

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
        self._message = str(value)
        return value

    def obstacle_detection(self, start_angle, end_angle, cap=NO_DETECTION):
        if end_angle < start_angle:
            start_angle, end_angle = end_angle, start_angle
        detection = NO_DETECTION
        for bearing, distance in self.obstacle_detection_rays.items():
            if start_angle <= bearing and bearing <= end_angle:
                detection = min(detection, distance)
        if detection > cap:
            return NO_DETECTION
        return detection

    def obstacle_detection_range(self, angle):
        angle = abs(angle)
        angles = [0, 2, 6, 10, 22, 45]
        ranges = [150, 100, 90, 40, 40, 30]
        for i in range(len(angles)):
            if angle <= angles[i]:
                if i == 0:
                    return ranges[0]
                else:
                    interp = (angle - angles[i - 1]) / (angles[i] - angles[i - 1])
                    return ranges[i - 1] * (1 - interp) + ranges[i] * interp
        return 0

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
