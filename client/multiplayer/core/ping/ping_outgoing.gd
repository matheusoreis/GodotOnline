class_name PingOutgoing extends ClientMessage


func _init() -> void:
	super._init(ClientHeaders.Headers.PING)
	Globals.sender_ping_time = Time.get_ticks_msec()
