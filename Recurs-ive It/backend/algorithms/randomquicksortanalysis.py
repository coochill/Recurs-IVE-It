import random

def randomized_quick_sort_tree(n):
    """Generate a detailed tree structure for the randomized quicksort recurrence and count base cases, repeated subproblems, and total nodes."""
    
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
            node['value'] = c = 1  
            node['type'] = 'base_case'
            node['return_value'] = c
            counters['total_base_cases'] += 1 
        else:
           
            if n in seen_subproblems:
                seen_subproblems[n] += 1
                node['type'] = 'repeat'
                node['message'] = 'subproblem_repeated'
                counters['total_repeated_subproblems'] += 1  
            else:
                seen_subproblems[n] = 1  

            # Randomized partitioning step 
            i = random.randint(0, n-1)  
            child1 = recurse(n - i - 1, depth + 1, seen_subproblems)
            child2 = recurse(i, depth + 1, seen_subproblems)
            
            
            if child1['n'] > child2['n']:
                node['children'] = [child2, child1]
            else:
                node['children'] = [child1, child2]

            
            c = 1  
            node['value'] = child1['value'] + child2['value'] + c * n
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
