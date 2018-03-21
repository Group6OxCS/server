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

local Car = {}
Car.__index = Car

local Car_attribute_setters = {
  forward = function(self, bool)
    local priv = getmetatable(self).priv
    assert(bool == true or bool == false)
    priv.forward = bool
  end,

  backward = function(self, bool)
    local priv = getmetatable(self).priv
    assert(bool == true or bool == false)
    priv.backward = bool
  end,

  left = function(self, bool)
    local priv = getmetatable(self).priv
    assert(bool == true or bool == false)
    priv.left = bool
  end,

  right = function(self, bool)
    local priv = getmetatable(self).priv
    assert(bool == true or bool == false)
    priv.right = bool
  end
}

function Car:new()
  local priv = {
      forward = false,
      backward = false,
      left = false,
      right = false
  } -- private attributes in instance
  local self = make_proxy(Car, priv, nil, Car_attribute_setters, true)
  return self
end

function module.verify()
    captured_control = _G.control
end

function to_car(data)
    local car = Car:new()
    local dp = json.decode(data)
    for k, v in pairs(dp) do
        car[k] = v
    end
    return car
end

function from_car(car)
    return json.encode({
        forward = car.forward,
        backward = car.backward,
        left = car.left,
        right = car.right
    })
end

function module.call_control(data)
    local car = to_car(data)
    captured_control(car)
    return from_car(car)
end

return module
