class_name CreateAccountIncoming extends RefCounted


func handle(scene_tree: SceneTree, _server_message: ServerMessage) -> void:
	var access_account_ui: AccessAccountUI = scene_tree.root.get_node(
		'/root/main/menu_ui/access_account_ui'
	)
	access_account_ui.show()

	var create_account_ui: CreateAccountUI = scene_tree.root.get_node(
		'/root/main/menu_ui/create_account_ui'
	)
	create_account_ui.hide()
