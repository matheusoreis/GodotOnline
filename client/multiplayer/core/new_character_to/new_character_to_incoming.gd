class_name NewCharacterToIncoming extends RefCounted


func handle(scene_tree: SceneTree, server_message: ServerMessage) -> void:
	var character_id: int = server_message.get_int32()
	var character_name: String = server_message.get_string()
	var character_world: int = server_message.get_int32()
	var character_direction: int = server_message.get_int8()
	var character_position: Vector2 = Vector2(
		server_message.get_int32(),
		server_message.get_int32(),
	)
	var character_sprite: String = server_message.get_string()

	var current_map: WorldBase = WorldHelper.new().ensure_world_is_instantiated(
		scene_tree, character_world
	)

	current_map.spawn_character(
		character_id,
		character_name,
		character_direction,
		character_position,
		character_sprite,
		false
	)
