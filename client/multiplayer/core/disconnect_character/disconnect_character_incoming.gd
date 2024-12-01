class_name DisconnectCharacterIncoming extends RefCounted


func handle(scene_tree: SceneTree, server_message: ServerMessage) -> void:
	var character_id: int = server_message.get_int32()
	var character_world: int = server_message.get_int32()

	var current_map_node: Node2D = scene_tree.root.get_node_or_null(
		'/root/main/game/map' + str(character_world)
	)

	if current_map_node:
		var current_spawns_node: Node2D = scene_tree.root.get_node_or_null(
			'/root/main/game/map' + str(character_world) + '/spawns'
		)

		var remote_character_node: CharacterBase = current_spawns_node.get_node_or_null(
			str(character_id)
		)

		if remote_character_node:
			remote_character_node.queue_free()
