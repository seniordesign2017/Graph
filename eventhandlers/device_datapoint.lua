--#EVENT device datapoint
--[[
  data
  The data from the device

  data.api enum string (write|record)
  Provider API

  data.rid string
  Unique device resource id

  data.seq integer
  The message sequence number for specific resource id

  data.alias string
  Device resource alias

  data.value table{1 = "live"|timestamp, 2 = value}
  Data transmitted by the device

  data.vendor string
  Device vendor identifier

  data.device_sn string
  Device Serial number

  data.source_ip string
  The device source ip

  data.timestamp integer
  Event time
--]]

-- Record timeseries data
util.write_log{
  value = data.value[2],
  alias = data.alias,
  device_sn = data.device_sn,
  timestamp = data.timestamp
}

local value = util.kv_read(data.device_sn)
if value == nil then
  value = {}
  for _, alias in ipairs(util.get_device_aliases()) do
    value[alias] = nil
  end
end
value[data.alias] = data.value[2]
-- store the last timestamp from this device
value["timestamp"] = data.timestamp/1000
value["pid"] = data.vendor or data.pid
value["ip"] = data.source_ip
value["rid"] = data.rid

util.kv_write(data.device_sn, value)
