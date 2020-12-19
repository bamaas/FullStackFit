package app.weeklyaverage;

import app.entry.EntryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class WeeklyAverageService {

    private final Logger logger = LoggerFactory.getLogger(EntryService.class);

    @Autowired
    private WeeklyAverageRepository weeklyAverageRepository;

    public WeeklyAverage getWeeklyAverage(Short year, Byte week){
        logger.trace("Getting WeeklyAverage with year {} and week {}.", year, week);
        return weeklyAverageRepository.findByYearAndWeek(year, week);
    }

    public List<WeeklyAverage> getAllSortedByYearAndWeek(){
        logger.trace("Getting all WeeklyAverage sorted by year and week.");
        return weeklyAverageRepository.getAllSortedByYearAndWeek();
    }

}
