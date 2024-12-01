class_name NotificationUI extends PanelContainer


@export var timer: Timer
@export var label: Label
@export_range(0, 10) var timeout: int = 5


func _on_timer_timeout() -> void:
	timer.wait_time = timeout
	queue_free()


func show_notification(scene_tree: SceneTree, message: String) -> void:
	var notification_preload: PackedScene = preload(
		'res://scenes/ui/notification/notification.tscn'
	)

	var notification_instantiate: NotificationUI = notification_preload.instantiate()
	notification_instantiate.label.text = message

	var notification_panel_root: String = '/root/main/notification_location/content_vbox'
	var notification_node := scene_tree.root.get_node(notification_panel_root)
	notification_node.add_child(notification_instantiate)


func _on_button_pressed() -> void:
	queue_free()
