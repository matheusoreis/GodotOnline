class_name MoveCharacterToOthersIncoming extends RefCounted


func handle(scene_tree: SceneTree, server_message: ServerMessage) -> void:
	var character_id: int = server_message.get_int32()
	var character_world: int = server_message.get_int32()
	var character_action: int = server_message.get_int8()
	var character_direction: int = server_message.get_int8()
	var character_position: Vector2 = Vector2(
		server_message.get_int32(),
		server_message.get_int32(),
	)

	var current_world_node: Node2D = scene_tree.root.get_node_or_null(
		'/root/main/game/map' + str(character_world)
	)

	var current_spawns_node: Node2D = scene_tree.root.get_node_or_null(
		'/root/main/game/map' + str(character_world) + '/spawns'
	)

	if current_world_node:
		var remote_character_node: CharacterBase = current_spawns_node.get_node_or_null(
			str(character_id)
		)

		if remote_character_node and !remote_character_node.is_local_player:
			remote_character_node.update_remote_position(
				remote_character_node.int_to_action(character_action),
				remote_character_node.int_to_direction(character_direction),
				character_position,
			)
