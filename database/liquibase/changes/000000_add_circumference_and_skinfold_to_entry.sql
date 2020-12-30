--liquibase formatted sql
--changeset bas:1
ALTER TABLE public.entry
    ADD skinfold_chest SMALLINT,
    ADD skinfold_abdominal SMALLINT,
    ADD skinfold_biceps SMALLINT,
    ADD skinfold_triceps SMALLINT,
    ADD skinfold_thigh SMALLINT,
    ADD skinfold_calf SMALLINT,
    ADD circ_chest SMALLINT,
    ADD circ_arm SMALLINT,
    ADD circ_leg SMALLINT,
    ADD circ_calf SMALLINT,
    ADD circ_waist SMALLINT,
    ADD circ_neck SMALLINT