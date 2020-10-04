package app.weeklyaverage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class WeeklyAverageService {

    @Autowired
    private WeeklyAverageRepository weeklyAverageRepository;

    public void updateWeeklyAverage(WeeklyAverage weeklyAverage){
        weeklyAverageRepository.save(weeklyAverage);
    }

    public WeeklyAverage getWeeklyAverage(Short year, Byte week){
        return weeklyAverageRepository.findByYearAndWeek(year, week);
    }

}
