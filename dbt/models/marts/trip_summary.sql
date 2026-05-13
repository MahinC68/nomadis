SELECT
    destination,
    COUNT(*)                                              AS total_trips,
    ROUND(AVG(avg_match_score)::numeric, 2)              AS avg_match_score,
    ROUND(AVG(trip_length_days)::numeric, 1)             AS avg_trip_length,
    mode() WITHIN GROUP (ORDER BY budget_range)          AS most_common_budget
FROM {{ source('nomadis', 'trips') }}
GROUP BY destination
ORDER BY total_trips DESC
