class_name NotificationIncoming extends RefCounted


func handle(scene_tree: SceneTree, server_message: ServerMessage) -> void:
	var message: String = server_message.get_string()

	var notification_preload: PackedScene = preload(
		'res://scenes/ui/notification/notification.tscn'
	)

	var notification_instantiate: NotificationUI = notification_preload.instantiate()
	notification_instantiate.show_notification(scene_tree, message)
