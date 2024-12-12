def merge_sort_tree(n):
    """Generate a detailed tree structure for Merge Sort recursion and count base cases, repeated subproblems, and total nodes."""

    # Initialize counters
    counters = {
        'total_base_cases': 0,
        'total_repeated_subproblems': 0,
        'total_nodes': 0
    }

    # Input validation for floating-point numbers
    if not isinstance(n, (int, float)) or n <= 0:
        raise ValueError("Input must be a positive number (integer or float).")

    def recurse(n, depth, seen_subproblems, is_initial=False):
        """Helper function to recursively build the tree and count types of nodes."""
        # Increment total nodes
        counters['total_nodes'] += 1

        # Create a node for the current call
        node = {
            'n': n,
            'depth': depth,
            'children': [],
            'type': 'call',  
            'is_initial': is_initial  
        }

        # Base case
        if n <= 1:
            node['value'] = 1  
            node['type'] = 'base_case'
            node['return_value'] = 1
            counters['total_base_cases'] += 1  
        else:
            # Check for the occurrence of this subproblem
            if n in seen_subproblems:
                seen_subproblems[n] += 1
                node['type'] = 'repeat'
                node['message'] = 'subproblem_repeated'
                counters['total_repeated_subproblems'] += 1 
            else:
                seen_subproblems[n] = 1  

            # Recurse for the two halves of the current problem (n/2)
            try:
                child1 = recurse(n / 2, depth + 1, seen_subproblems)
                child2 = recurse(n / 2, depth + 1, seen_subproblems)
            except RecursionError:
                raise RuntimeError("Maximum recursion depth exceeded. Please check the input value.")

            node['children'].append(child1)
            node['children'].append(child2)

            # Calculate the value of the current node
            node['value'] = child1['value'] + child2['value'] + n  
            node['return_value'] = node['value']

        return node

    seen_subproblems = {} 
    tree = recurse(n, 0, seen_subproblems, is_initial=True)

    return {
        'tree': tree,
        'total_base_cases': counters['total_base_cases'],
        'total_repeated_subproblems': counters['total_repeated_subproblems'],
        'total_nodes': counters['total_nodes']
    }
