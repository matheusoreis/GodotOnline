class_name WorldHelper extends Node


func ensure_world_is_instantiated(scene_tree: SceneTree, world: int) -> WorldBase:
	var alert_ui: AlertUI = AlertUI.new()

	var world_node: WorldBase = scene_tree.root.get_node_or_null(
		'/root/main/game/map' + str(world)
	)

	if world_node == null:
		alert_ui.show_alert(scene_tree, 'Erro ao processar o mapa, desconectando...')
		Multiplayer.websocket.disconnect_from_host()

		return;

	return world_node
