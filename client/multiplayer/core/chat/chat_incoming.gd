class_name ChatIncoming extends RefCounted


enum CHAT_CHANNELS {
	MAP,
	GLOBAL
}


func handle(scene_tree: SceneTree, server_message: ServerMessage) -> void:
	var channel: int = server_message.get_int8()
	var message: String = server_message.get_string()
	var character_name: String = server_message.get_string()

	var chat_history_node: ChatUI = scene_tree.root.get_node(
		'/root/main/game_ui/chat_ui'
	)

	var formatted_message = ''

	if channel == CHAT_CHANNELS.MAP:
		formatted_message = '[MAP] ' + character_name + ': ' + message
	elif  channel == CHAT_CHANNELS.GLOBAL:
		formatted_message = '[GLOBAL] ' + character_name + ': ' + message

	chat_history_node.add_history_message(formatted_message)
