class_name AccessAccountIncoming extends RefCounted

func handle(scene_tree: SceneTree, server_message: ServerMessage) -> void:
	Globals.account_token = server_message.get_string()

	var access_account_ui: AccessAccountUI = scene_tree.root.get_node(
		'/root/main/menu_ui/access_account_ui'
	)

	access_account_ui.hide()
	CharacterListOutgoing.new().send()
