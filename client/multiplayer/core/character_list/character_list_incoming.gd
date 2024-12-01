class_name CharacterListIncoming extends RefCounted


func handle(scene_tree: SceneTree, server_message: ServerMessage) -> void:
	var character_length: int = server_message.get_int8()
	var character_max_slots: int = server_message.get_int8()

	var character_list_ui: CharacterListUI = scene_tree.root.get_node(
		'/root/main/menu_ui/character_list_ui'
	)


	var characters: Array = []

	for i in range(character_length):
		var character_id: int = server_message.get_int32()
		var character_name: String = server_message.get_string()
		var character_gender: String = server_message.get_string()
		var character_world: int = server_message.get_int32()
		var character_direction: int = server_message.get_int8();
		var character_position_x: int = server_message.get_int32()
		var character_position_y: int = server_message.get_int32()
		var character_sprite: String = server_message.get_string()

		var character_data: Dictionary = {
			"character_id": character_id,
			"character_name": character_name,
			"character_gender": character_gender,
			"character_world": character_world,
			"character_position_x": character_position_x,
			"character_position_y": character_position_y,
			"character_direction": character_direction,
			"character_sprite": character_sprite,
		}

		characters.append(character_data)

	character_list_ui.show()
	character_list_ui.update_character_panels(
		characters,
		character_max_slots
	)
