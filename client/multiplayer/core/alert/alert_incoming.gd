class_name AlertIncoming extends RefCounted


func handle(scene_tree: SceneTree, server_message: ServerMessage) -> void:
	var message: String = server_message.get_string()
	var should_disconnect: int = server_message.get_int8()

	print(message)

	#if should_disconnect == 1:
		#Multiplayer.websocket.disconnect_from_host()
		#return
#
	#var alert_preload: PackedScene = preload(
		#'res://scenes/ui/alert/alert.tscn'
	#)
#
	#var alert_instantiate: AlertUI = alert_preload.instantiate()
	#alert_instantiate.show_alert(scene_tree, message)
