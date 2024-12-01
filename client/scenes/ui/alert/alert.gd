class_name AlertUI extends PanelContainer


@export var label: Label


func show_alert(scene_tree: SceneTree, message: String) -> void:
	var alert_preload: PackedScene = preload(
		'res://scenes/ui/alert/alert.tscn'
	)

	var alert_instantiate: AlertUI = alert_preload.instantiate()
	alert_instantiate.label.text = message

	var alert_panel_root: String = '/root/main'
	var alert_node := scene_tree.root.get_node(alert_panel_root)

	alert_node.add_child(alert_instantiate)


func _on_close_button_pressed() -> void:
	self.queue_free()
