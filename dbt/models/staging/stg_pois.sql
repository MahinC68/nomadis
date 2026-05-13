SELECT
    id,
    name,
    city,
    category,
    avg_cost,
    duration_mins,
    indoor_outdoor,
    adventure_score,
    culture_score,
    relaxation_score,
    nightlife_score,
    nature_score,
    food_score,
    ROUND(
        (
            adventure_score + culture_score + relaxation_score +
            nightlife_score + nature_score  + food_score
        )::numeric / 6.0,
        4
    ) AS profile_strength
FROM {{ source('nomadis', 'pois') }}
WHERE NOT (
    COALESCE(adventure_score,  0) = 0
    AND COALESCE(culture_score,    0) = 0
    AND COALESCE(relaxation_score, 0) = 0
    AND COALESCE(nightlife_score,  0) = 0
    AND COALESCE(nature_score,     0) = 0
    AND COALESCE(food_score,       0) = 0
)
