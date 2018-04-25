api = {
    NO_DETECTION: 10000,
    Car: class {
        constructor(data) {
            console.log(this);
            this._steering = 0.0;
            this._acceleration = 0.0;
            this._brake = 0.0;
            this._nitro = 0.0;
            this._message = "";
            data = JSON.parse(data);
            var this_ = this;
            Object.keys(data).forEach(function (k) {
                if (k == "obstacle_detection_rays") {
                    this_.obstacle_detection_rays = {};
                    data[k].forEach(function (v) {
                        this_.obstacle_detection_rays[v.bearing] = v.distance;
                    });
                }
                else {
                    this_[k] = data[k];
                }
            });
        }

        get steering() {
            return this._steering;
        }

        set steering(value) {
            this._steering = parseFloat(value)
        }

        get acceleration() {
            return this._acceleration;
        }

        set acceleration(value) {
            this._acceleration = parseFloat(value)
        }

        get brake() {
            return this._brake;
        }

        set brake(value) {
            this._brake = parseFloat(value)
        }

        get nitro() {
            return this._nitro;
        }

        set nitro(value) {
            this._nitro = parseFloat(value)
        }

        get message() {
            return this._message;
        }

        set message(value) {
            this._message = String(value)
        }

        obstacle_detection(start_angle, end_angle, cap) {
            var this_ = this;
            if (end_angle < start_angle) {
                var tmp = start_angle
                start_angle = end_angle
                end_angle = tmp
            }
            var detection = api.NO_DETECTION;
            Object.keys(this_.obstacle_detection_rays).forEach(function (bearing) {
                var distance = this_.obstacle_detection_rays[bearing];
                if (start_angle <= bearing && bearing <= end_angle) {
                    detection = Math.min(detection, distance);
                }
            });
            if (cap !== undefined && detection > cap) {
                return api.NO_DETECTION;
            }
            return detection;
        }

        serialize() {
            return JSON.stringify({
                steering: this._steering,
                acceleration: this._acceleration,
                brake: this._brake,
                nitro: this._nitro,
                message: this._message
            });
        }
    }
}
