def fibonacci_tree(n):
    """Generate a detailed tree structure for Fibonacci recursion and count base cases, repeated subproblems, and total nodes."""

    # Initialize counters
    counters = {
        'total_base_cases': 0,
        'total_repeated_subproblems': 0,
        'total_nodes': 0
    }

    # Input validation
    if not isinstance(n, int) or n < 0:
        raise ValueError("Input must be a non-negative integer.")

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

        # Base cases
        if n == 0:
            node['value'] = 0
            node['type'] = 'base_case'
            node['return_value'] = 0
            counters['total_base_cases'] += 1  
        elif n == 1:
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

            # Recurse for the next Fibonacci numbers
            try:
                child1 = recurse(n - 1, depth + 1, seen_subproblems)
                child2 = recurse(n - 2, depth + 1, seen_subproblems)
            except RecursionError:
                raise RuntimeError("Maximum recursion depth exceeded. Please check the input value.")

            node['children'].append(child1)
            node['children'].append(child2)

            # Calculate the value of the current node as the sum of its children
            node['value'] = child1['value'] + child2['value']
            node['return_value'] = node['value']

        return node

    # Start the recursion and generate the tree, with initial state marked as True for the root
    seen_subproblems = {}  # Track seen subproblems
    tree = recurse(n, 0, seen_subproblems, is_initial=True)

    # Add the counts to the result
    return {
        'tree': tree,
        'total_base_cases': counters['total_base_cases'],
        'total_repeated_subproblems': counters['total_repeated_subproblems'],
        'total_nodes': counters['total_nodes']
    }
