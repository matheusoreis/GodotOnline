class_name CreateCharacterIncoming extends RefCounted


func handle(scene_tree: SceneTree, _server_message: ServerMessage) -> void:
	var create_character_ui: CreateCharacterUI = scene_tree.root.get_node(
		'/root/main/menu_ui/create_character_ui'
	)
	create_character_ui.hide()

	CharacterListOutgoing.new().send()
