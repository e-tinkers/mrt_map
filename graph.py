import json


def load_graph(file_name):
    with open(file_name) as f:
        data = json.load(f)
        return data


def find_path(graph, start, end, path=[]):
    path = path + [start]
    if start == end:
        return path
    if start not in list(graph.keys()):
        return None
    for node in graph[start]:
        if node not in path:
            newpath = find_path(graph, node, end, path)
            if newpath:
                return newpath
    return None


def all_paths(graph, start, end, path=[]):
    path = path + [start]
    if start == end:
        return [path]
    if start not in list(graph.keys()):
        return []
    paths = []
    for node in graph[start]:
        if node not in path:
            newpaths = all_paths(graph, node, end, path)
            for newpath in newpaths:
                paths.append(newpath)
    return paths


def shortest_path(graph, start, end, path=[]):
    path = path + [start]
    if start == end:
        return path
    if start not in list(graph.keys()):
        return None
    shortest = None
    for node in graph[start]:
        if node not in path:
            new_path = shortest_path(graph, node, end, path)
            if new_path:
                if not shortest or len(new_path) < len(shortest):
                    shortest = new_path
    return shortest

