class_name BlockCharacterMovementIncoming extends RefCounted


func handle(scene_tree: SceneTree, server_message: ServerMessage) -> void:
	var character_id: int = server_message.get_int32()
	var character_world: int = server_message.get_int32()

	print(character_id)

	var current_world_node: Node2D = scene_tree.root.get_node_or_null(
		'/root/main/game/map' + str(character_world)
	)

	var current_spawns_node: Node2D = scene_tree.root.get_node_or_null(
		'/root/main/game/map' + str(character_world) + '/spawns'
	)

	if current_world_node:
		var character_node: CharacterBase = current_spawns_node.get_node_or_null(
			str(character_id)
		)

		if character_node:
			character_node.is_movement_blocked = true
