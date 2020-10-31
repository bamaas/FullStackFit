CREATE TABLE public.entry (id SERIAL PRIMARY KEY, date TIMESTAMP, weight REAL, note TEXT, year SMALLINT, week SMALLINT);

CREATE TABLE public.weekly_average (year SMALLINT, week SMALLINT, weight_average REAL, weight_measurement_count SMALLINT, PRIMARY KEY (year, week));

CREATE FUNCTION update_weekly_average() RETURNS trigger AS $BODY$
DECLARE avg_weight REAL;
DECLARE avg_weight_prev REAL;
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
        SELECT ROUND(AVG(weight)::numeric,1) FROM public.entry WHERE year = NEW.year AND week = NEW.week INTO avg_weight;
        UPDATE public.weekly_average SET weight_average = avg_weight WHERE week = NEW.week AND year = NEW.year; 
        IF NOT FOUND THEN 
            INSERT INTO weekly_average (year, week, weight_average) VALUES (NEW.year, NEW.week, avg_weight); 
        END IF;
        -- set weight_measurement_count
        UPDATE public.weekly_average SET weight_measurement_count = (SELECT COUNT(weight) FROM public.entry WHERE year = NEW.year AND week = NEW.week) WHERE year = NEW.year AND week = NEW.week;
        RETURN NEW;
    END;
$BODY$ LANGUAGE plpgsql;

CREATE TRIGGER update_weekly_average AFTER INSERT OR UPDATE ON public.entry
    FOR EACH ROW EXECUTE PROCEDURE update_weekly_average();

CREATE FUNCTION update_record_count_on_entry_delete() RETURNS trigger AS $BODY$
    BEGIN
        UPDATE public.weekly_average SET weight_measurement_count = (SELECT COUNT(weight) FROM public.entry WHERE year = OLD.year AND week = OLD.week) WHERE year = OLD.year AND week = OLD.week;
        RETURN NEW;
    END;
$BODY$ LANGUAGE plpgsql;

CREATE TRIGGER update_record_count_on_entry_delete AFTER DELETE ON public.entry
    FOR EACH ROW EXECUTE PROCEDURE update_record_count_on_entry_delete();

CREATE FUNCTION delete_weekly_average_if_no_records_in_entries() RETURNS trigger AS $BODY$
    BEGIN
        IF NOT EXISTS (SELECT FROM public.entry WHERE year = OLD.year AND week = OLD.week) THEN
            DELETE FROM weekly_average WHERE year = OLD.year AND week = OLD.week;
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
        NEW.year := (SELECT EXTRACT(YEAR FROM NEW.date));
		NEW.week := (SELECT FLOOR((DATE_PART('doy', NEW.date)) / 7));
        RETURN NEW;
    END;
$BODY$ LANGUAGE plpgsql;

CREATE TRIGGER update_entry_year_and_week BEFORE INSERT OR UPDATE ON public.entry
    FOR EACH ROW EXECUTE PROCEDURE update_entry_year_and_week();