import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { itemType, itemId } = await req.json();

    if (!itemType || !itemId) {
      throw new Error('itemType and itemId are required');
    }

    let matchesFound = 0;

    if (itemType === 'lost') {
      // Get the lost item
      const { data: lostItem, error: lostError } = await supabaseClient
        .from('lost_items')
        .select('*')
        .eq('id', itemId)
        .single();

      if (lostError || !lostItem) {
        throw new Error('Lost item not found');
      }

      // Get all found items from the same campus
      const { data: foundItems, error: foundError } = await supabaseClient
        .from('found_items')
        .select('*')
        .eq('campus', lostItem.campus);

      if (foundError) {
        throw new Error('Error fetching found items');
      }

      // Check each found item for matches
      for (const foundItem of foundItems || []) {
        // Skip if already matched
        const { data: existingMatch } = await supabaseClient
          .from('matches')
          .select('id')
          .eq('lost_item_id', lostItem.id)
          .eq('found_item_id', foundItem.id)
          .maybeSingle();

        if (existingMatch) continue;

        // Call AI matching function
        const matchResponse = await supabaseClient.functions.invoke('ai-match-items', {
          body: { lostItem, foundItem },
        });

        if (matchResponse.data?.is_match) {
          matchesFound++;
        }
      }
    } else if (itemType === 'found') {
      // Get the found item
      const { data: foundItem, error: foundError } = await supabaseClient
        .from('found_items')
        .select('*')
        .eq('id', itemId)
        .single();

      if (foundError || !foundItem) {
        throw new Error('Found item not found');
      }

      // Get all lost items from the same campus
      const { data: lostItems, error: lostError } = await supabaseClient
        .from('lost_items')
        .select('*')
        .eq('campus', foundItem.campus);

      if (lostError) {
        throw new Error('Error fetching lost items');
      }

      // Check each lost item for matches
      for (const lostItem of lostItems || []) {
        // Skip if already matched
        const { data: existingMatch } = await supabaseClient
          .from('matches')
          .select('id')
          .eq('lost_item_id', lostItem.id)
          .eq('found_item_id', foundItem.id)
          .maybeSingle();

        if (existingMatch) continue;

        // Call AI matching function
        const matchResponse = await supabaseClient.functions.invoke('ai-match-items', {
          body: { lostItem, foundItem },
        });

        if (matchResponse.data?.is_match) {
          matchesFound++;
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, matchesFound }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in auto-match-items:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
