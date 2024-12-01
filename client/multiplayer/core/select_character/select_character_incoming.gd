class_name SelectCharacterIncoming extends RefCounted


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

	var menu_ui: CanvasLayer = scene_tree.root.get_node(
		'/root/main/menu_ui'
	)
	menu_ui.hide()

	var game_ui: CanvasLayer = scene_tree.root.get_node(
		'/root/main/game_ui'
	)
	game_ui.show()

	var current_world_scene: PackedScene = load(
		'res://scenes/maps/list/' + str(character_world) + '.tscn'
	)

	var world_instantiate: WorldBase = current_world_scene.instantiate()
	world_instantiate.name = 'map' + str(character_world)

	var current_game_node: Node = scene_tree.root.get_node(
		'/root/main/game'
	)
	current_game_node.add_child(world_instantiate)
	world_instantiate.spawn_character(
		character_id,
		character_name,
		character_direction,
		character_position,
		character_sprite,
		true
	)

	var menu_canvas_node: CanvasLayer = scene_tree.root.get_node(
		'/root/main/menu_ui'
	)
	menu_canvas_node.hide()

	var game_canvas_node: CanvasLayer = scene_tree.root.get_node(
		'/root/main/game_ui'
	)
	game_canvas_node.show()
