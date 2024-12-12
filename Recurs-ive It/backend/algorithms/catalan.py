def catalan_tree(n):
    """Generate a detailed tree structure for Catalan number recursion with a base case of n == 0 and count total nodes."""

    # Initialize counters
    counters = {
        'total_base_cases': 0,
        'total_nodes': 0
    }

    # Input validation
    if not isinstance(n, int) or n < 0:
        raise ValueError("Input must be a non-negative integer.")

    def recurse(n, depth, is_initial=False):
        """Helper function to recursively build the tree and count nodes."""
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
        if n == 0:
            node['value'] = 1
            node['type'] = 'base_case'
            node['return_value'] = 1
            counters['total_base_cases'] += 1 
        else:
            # Recurse for the next value of the Catalan number
            try:
                child = recurse(n - 1, depth + 1)
            except RecursionError:
                raise RuntimeError("Maximum recursion depth exceeded. Please check the input value.")
            
            node['children'].append(child)

            # Calculate the value using the recursive Catalan formula
            node['value'] = child['value'] * 2 * n * (2 * n - 1) / (n + 1) / n
            node['return_value'] = node['value']

        return node

    # Start the recursion and generate the tree, with initial state marked as True for the root
    tree = recurse(n, 0, is_initial=True)

    # Add the counts to the result
    return {
        'tree': tree,
        'total_base_cases': counters['total_base_cases'],
        'total_nodes': counters['total_nodes']
    }
