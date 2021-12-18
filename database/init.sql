CREATE SCHEMA iam;

CREATE TABLE public.user (
    id VARCHAR NOT NULL UNIQUE PRIMARY KEY
);

CREATE UNIQUE INDEX user_id ON public.user(id);

CREATE TABLE public.entry (
    id SERIAL NOT NULL UNIQUE PRIMARY KEY, 
    date TIMESTAMP,
    weight REAL,
    note TEXT, 
    year SMALLINT, 
    week SMALLINT, 
    user_id VARCHAR,
    FOREIGN KEY (user_id) REFERENCES public.user(id),
    skinfold_chest SMALLINT,
    skinfold_abdominal SMALLINT,
    skinfold_biceps SMALLINT,
    skinfold_triceps SMALLINT,
    skinfold_thigh SMALLINT,
    skinfold_calf SMALLINT,
    circ_chest SMALLINT,
    circ_arm SMALLINT,
    circ_leg SMALLINT,
    circ_calf SMALLINT,
    circ_waist SMALLINT,
    circ_neck SMALLINT
);

CREATE TABLE public.weekly_average (
    year SMALLINT, 
    week SMALLINT, 
    weight_average REAL, 
    weight_measurement_count SMALLINT, 
    user_id VARCHAR,
    PRIMARY KEY (year, week, user_id), 
    FOREIGN KEY (user_id) REFERENCES public.user(id)
);

CREATE FUNCTION update_weekly_average() RETURNS trigger AS $BODY$
DECLARE avg_weight REAL;
    BEGIN
        IF NEW.weight IS NULL THEN
            RAISE EXCEPTION 'weight cannot be null';
        END IF;
        IF NEW.year IS NULL THEN
            RAISE EXCEPTION 'year cannot be null';
        END IF;
        IF NEW.week IS NULL THEN
            RAISE EXCEPTION 'week cannot be null';
        END IF;
        --  set weight_average
        SELECT ROUND(AVG(weight)::numeric,1) FROM public.entry WHERE year = NEW.year AND week = NEW.week AND user_id = NEW.user_id INTO avg_weight;
        UPDATE public.weekly_average SET weight_average = avg_weight WHERE week = NEW.week AND year = NEW.year AND user_id = NEW.user_id; 
        IF NOT FOUND THEN 
            INSERT INTO public.weekly_average (year, week, weight_average, user_id) VALUES (NEW.year, NEW.week, avg_weight, NEW.user_id); 
        END IF;
        -- set weight_measurement_count
        UPDATE public.weekly_average SET weight_measurement_count = (SELECT COUNT(weight) FROM public.entry WHERE year = NEW.year AND week = NEW.week AND user_id = NEW.user_id) WHERE year = NEW.year AND week = NEW.week AND user_id = NEW.user_id;
        RETURN NEW;
    END;
$BODY$ LANGUAGE plpgsql;

CREATE TRIGGER update_weekly_average AFTER INSERT OR UPDATE ON public.entry
    FOR EACH ROW EXECUTE PROCEDURE update_weekly_average();

CREATE FUNCTION update_weekly_average_weight_on_entry_delete() RETURNS trigger AS $BODY$
DECLARE avg_weight REAL;
    BEGIN
        SELECT ROUND(AVG(weight)::numeric,1) FROM public.entry WHERE year = OLD.year AND week = OLD.week AND user_id = OLD.user_id INTO avg_weight;
        UPDATE public.weekly_average SET weight_average = avg_weight WHERE week = OLD.week AND year = OLD.year AND user_id = OLD.user_id;
        RETURN NEW;
    END;
$BODY$ LANGUAGE plpgsql;

CREATE TRIGGER update_weekly_average_weight_on_entry_delete AFTER DELETE ON public.entry
    FOR EACH ROW EXECUTE PROCEDURE update_weekly_average_weight_on_entry_delete();

CREATE FUNCTION update_record_count_on_entry_delete() RETURNS trigger AS $BODY$
    BEGIN
        UPDATE public.weekly_average SET weight_measurement_count = (SELECT COUNT(weight) FROM public.entry WHERE year = OLD.year AND week = OLD.week AND user_id = OLD.user_id) WHERE year = OLD.year AND week = OLD.week AND user_id = OLD.user_id;
        RETURN NEW;
    END;
$BODY$ LANGUAGE plpgsql;

CREATE TRIGGER update_record_count_on_entry_delete AFTER DELETE ON public.entry
    FOR EACH ROW EXECUTE PROCEDURE update_record_count_on_entry_delete();

CREATE FUNCTION delete_weekly_average_if_no_records_in_entries() RETURNS trigger AS $BODY$
    BEGIN
        IF NOT EXISTS (SELECT FROM public.entry WHERE year = OLD.year AND week = OLD.week AND user_id = OLD.user_id) THEN
            DELETE FROM weekly_average WHERE year = OLD.year AND week = OLD.week AND user_id = OLD.user_id;
        END IF;
        RETURN NEW;
    END;
$BODY$ LANGUAGE plpgsql;

CREATE TRIGGER delete_weekly_average_if_no_records_in_entries AFTER DELETE ON public.entry
    FOR EACH ROW EXECUTE PROCEDURE delete_weekly_average_if_no_records_in_entries();

CREATE FUNCTION update_entry_year_and_week() RETURNS trigger AS $BODY$
    BEGIN
        IF NEW.date IS NULL THEN
            RAISE EXCEPTION 'date cannot be null';
        END IF;
        -- extract year and week from the date and update the value
        NEW.year := (SELECT EXTRACT(YEAR FROM NEW.date));
		NEW.week := (SELECT FLOOR((DATE_PART('doy', NEW.date)) / 7));
        RETURN NEW;
    END;
$BODY$ LANGUAGE plpgsql;

CREATE TRIGGER update_entry_year_and_week BEFORE INSERT OR UPDATE ON public.entry
    FOR EACH ROW EXECUTE PROCEDURE update_entry_year_and_week();

CREATE FUNCTION set_user_id() RETURNS trigger AS $BODY$
    BEGIN
        IF NEW.user_id IS NULL THEN
            RAISE EXCEPTION 'user_id cannot be null';
        END IF;
        -- insert user_id in user table if not exists
        IF NOT EXISTS (SELECT FROM public.user WHERE id = NEW.user_id) THEN
            INSERT INTO public.user (id) VALUES (NEW.user_id);
        END IF;
        RETURN NEW;
    END;
$BODY$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_id BEFORE INSERT on public.entry
    FOR EACH ROW EXECUTE PROCEDURE set_user_id();