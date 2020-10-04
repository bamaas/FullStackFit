package app.weeklyaverage;

import app.weeklyaverage.WeeklyAverage;
import app.weeklyaverage.WeeklyAverageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@CrossOrigin
@RestController
@RequestMapping("/average/")
public class WeeklyAverageController {

    @Autowired
    private WeeklyAverageService weeklyAverageService;

    @GetMapping("/weight")
    public WeeklyAverage getAllEntries(
            @RequestParam() Short year,
            @RequestParam() Byte week
    ){
        return weeklyAverageService.getWeeklyAverage(year, week);
    }
}
