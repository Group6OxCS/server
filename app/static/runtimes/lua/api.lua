json = require("json");

-- From http://lua-users.org/wiki/ObjectProperties

-- Make proxy object with property support.
-- Notes:
--   If key is found in <getters> (or <setters>), then
--     corresponding function is used, else lookup turns to the
--     <class> metatable (or first to <priv> if <is_expose_private> is true).
--   Given a proxy object <self>, <priv> can be obtained with
--     getmetatable(self).priv .
-- @param class - metatable acting as the object class.
-- @param priv - table containing private data for object.
-- @param getters - table of getter functions
--                  with keys as property names. (default is nil)
-- @param setters - table of setter functions,
--                  with keys as property names. (default is nil)
-- @param is_expose_private - Boolean whether to expose <priv> through proxy.
--                  (default is nil/false)
-- @version 3 - 20060921 (D.Manura)
local function make_proxy(class, priv, getters, setters, is_expose_private)
    setmetatable(priv, class)    -- fallback priv lookups to class
    local fallback = is_expose_private and priv or class
    local index = getters and
        function(self, key)
            -- read from getter, else from fallback
            local func = getters[key]
            if func then return func(self) else return fallback[key] end
        end
        or fallback    -- default to fast property reads through table
    local newindex = setters and
        function(self, key, value)
            -- write to setter, else to proxy
            local func = setters[key]
            if func then func(self, value)
            else rawset(self, key, value) end
        end
        or fallback    -- default to fast property writes through table
    local proxy_mt = {                 -- create metatable for proxy object
        __newindex = newindex,
        __index = index,
        priv = priv
    }
    local self = setmetatable({}, proxy_mt)    -- create proxy object
    return self
end

local module = {}
local captured_control = nil

module.NO_DETECTION = 10000

local Car = {}
Car.__index = Car

local Car_attribute_setters = {
  steering = function(self, v)
    local priv = getmetatable(self).priv
    priv.steering = tonumber(v)
  end,

  acceleration = function(self, v)
    local priv = getmetatable(self).priv
    priv.acceleration = tonumber(v)
  end,

  brake = function(self, v)
    local priv = getmetatable(self).priv
    priv.brake = tonumber(v)
  end,

  nitro = function(self, v)
    local priv = getmetatable(self).priv
    priv.nitro = tonumber(v)
  end,

  message = function(self, v)
    local priv = getmetatable(self).priv
    priv.message = tostring(v)
  end
}

function Car:new()
  local priv = {
      steering = 0.0,
      acceleration = 0.0,
      brake = 0.0,
      nitro = 0.0,
      message = ""
  } -- private attributes in instance
  local self = make_proxy(Car, priv, nil, Car_attribute_setters, true)
  return self
end

function Car:obstacle_detection(start_angle, end_angle, cap)
    if type(start_angle) ~= "number" then
        error("number expected for start_angle (make sure to use car:obstacle_detection, not car.obstacle_detection)", 2)
    end
    if type(end_angle) ~= "number" then
        error("number expected for end_angle (make sure to use car:obstacle_detection, not car.obstacle_detection)", 2)
    end
    if type(end_angle) ~= "number" and end_angle ~= nil then
        error("number or nil expected for cap (make sure to use car:obstacle_detection, not car.obstacle_detection)", 2)
    end
    if end_angle < start_angle then
        start_angle, end_angle = end_angle, start_angle
    end
    local detection = module.NO_DETECTION
    for bearing, distance in pairs(self.obstacle_detection_rays) do
        if start_angle <= bearing and bearing <= end_angle then
            detection = math.min(detection, distance)
        end
    end
    if cap and detection > cap then
        return module.NO_DETECTION
    end
    return detection
end

function Car:obstacle_detection_range(angle)
    if type(angle) ~= "number" then
        error("number expected for angle (make sure to use car:obstacle_detection_range, not car.obstacle_detection_range)", 2)
    end
    angle = math.abs(angle)
    local angles = {0, 2, 6, 10, 22, 45}
    local ranges = {150, 100, 90, 40, 40, 30}
    local i = 1
    while i < 7 do
        if angle <= angles[i] then
            if i == 1 then
                return ranges[1]
            else
                local interp = (angle - angles[i - 1]) / (angles[i] - angles[i - 1])
                return ranges[i - 1] * (1 - interp) + ranges[i] * interp
            end
        end
        i = i + 1
    end
    return 0
end

function module.verify()
    captured_control = _G.control
    assert(captured_control ~= nil, "Could not find control function")
end

function to_car(data)
    local car = Car:new()
    local dp = json.decode(data)
    for k, v in pairs(dp) do
        if k == "obstacle_detection_rays" then
            car.obstacle_detection_rays = {}
            for i, odr in ipairs(v) do
                car.obstacle_detection_rays[odr.bearing] = odr.distance
            end
        else
            car[k] = v
        end
    end
    return car
end

function from_car(car)
    return json.encode({
        steering = car.steering,
        acceleration = car.acceleration,
        brake = car.brake,
        nitro = car.nitro,
        message = car.message
    })
end

function module.call_control(data)
    local car = to_car(data)
    captured_control(car)
    return from_car(car)
end

return module
