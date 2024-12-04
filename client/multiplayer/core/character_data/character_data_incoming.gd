class_name CharacterDataIncoming extends RefCounted


func handle(scene_tree: SceneTree, server_message: ServerMessage) -> void:
	var character_name: String = server_message.get_string()
	var character_gender: String = server_message.get_string()

	var character_list_ui: CharacterDataUI = scene_tree.root.get_node(
		'/root/main/game_ui/character_data_ui'
	)
	
	character_list_ui.update_character_data(character_name, character_gender)
	character_list_ui.show()
