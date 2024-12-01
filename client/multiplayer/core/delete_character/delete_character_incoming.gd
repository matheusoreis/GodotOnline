class_name DeleteCharacterIncoming extends RefCounted


func handle(scene_tree: SceneTree, _server_message: ServerMessage) -> void:
	var character_list_ui: CharacterListUI = scene_tree.root.get_node(
		'/root/main/menu_ui/character_list_ui'
	)
	character_list_ui.hide()

	CharacterListOutgoing.new().send()
