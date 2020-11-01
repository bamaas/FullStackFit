package app.weeklyaverage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@CrossOrigin
@RestController
@RequestMapping("/stats/avg")
public class WeeklyAverageController {

    @Autowired
    private WeeklyAverageService weeklyAverageService;

    @GetMapping("/weight")
    public WeeklyAverage get(
            @RequestParam() Short year,
            @RequestParam() Byte week
    ){
        return weeklyAverageService.getWeeklyAverage(year, week);
    }

    @GetMapping("/weight/all")
    public List<WeeklyAverage> getAll() {
        return weeklyAverageService.getAllSortedByYearAndWeek();
    }
}
