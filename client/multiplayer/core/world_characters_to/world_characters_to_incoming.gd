class_name WorldCharactersToIncoming extends RefCounted


func handle(scene_tree: SceneTree, server_message: ServerMessage) -> void:
	var world_helper: WorldHelper =  WorldHelper.new()

	var characters_length: int = server_message.get_int16()

	for i in range(characters_length):
		var character_id: int = server_message.get_int32()
		var character_name: String = server_message.get_string()
		var character_world: int = server_message.get_int32()
		var character_direction: int = server_message.get_int8()
		var character_position: Vector2 = Vector2(
			server_message.get_int32(),
			server_message.get_int32(),
		)
		var character_sprite: String = server_message.get_string()

		var current_world: WorldBase = world_helper.ensure_world_is_instantiated(
			scene_tree, character_world
		)

		current_world.spawn_character(
			character_id,
			character_name,
			character_direction,
			character_position,
			character_sprite,
			false
		)
