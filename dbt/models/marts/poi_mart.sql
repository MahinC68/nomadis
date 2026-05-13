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
    profile_strength,

    CASE
        WHEN adventure_score  = GREATEST(adventure_score, culture_score, relaxation_score, nightlife_score, nature_score, food_score) THEN 'adventure'
        WHEN culture_score    = GREATEST(adventure_score, culture_score, relaxation_score, nightlife_score, nature_score, food_score) THEN 'culture'
        WHEN relaxation_score = GREATEST(adventure_score, culture_score, relaxation_score, nightlife_score, nature_score, food_score) THEN 'relaxation'
        WHEN nightlife_score  = GREATEST(adventure_score, culture_score, relaxation_score, nightlife_score, nature_score, food_score) THEN 'nightlife'
        WHEN nature_score     = GREATEST(adventure_score, culture_score, relaxation_score, nightlife_score, nature_score, food_score) THEN 'nature'
        ELSE 'food'
    END AS dominant_category,

    (
        GREATEST(adventure_score, culture_score, relaxation_score, nightlife_score, nature_score, food_score)
        - profile_strength
    ) <= 0.3 AS is_balanced,

    ROUND(
        (avg_cost / NULLIF(duration_mins, 0))::numeric,
        4
    ) AS value_score

FROM {{ ref('stg_pois') }}
