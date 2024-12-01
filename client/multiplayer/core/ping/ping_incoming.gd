class_name PingIncoming extends RefCounted


func handle(_scene_tree: SceneTree, _server_message: ServerMessage) -> void:
	var receiver_time: float = Time.get_ticks_msec()
	var latency: float = round(receiver_time - Globals.sender_ping_time)

	PingOutgoing.new().send()
