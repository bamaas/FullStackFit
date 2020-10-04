package app.log;

import app.weeklyaverage.WeeklyAverage;
import app.weeklyaverage.WeeklyAverageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class LogService {

    @Autowired
    private LogRepository logRepository;

    @Autowired
    private WeeklyAverageService weeklyAverageService;

    public Log getLog(Long id){
        return logRepository.findById(id).orElse(null);
    }

    public Log addLog(Log log){
        logRepository.save(log);
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(log.getDate());
        byte week = (byte) calendar.get(Calendar.WEEK_OF_YEAR);
        short year = (short) calendar.get(Calendar.YEAR);
        float averageWeight = logRepository.getAverageWeightByYearAndWeek(year, week);
        weeklyAverageService.updateWeeklyAverage(new WeeklyAverage(year, week, averageWeight));
        return log;
    }

    public void deleteLog(long id){
        logRepository.deleteById(id);
    }

    public Log putLog(Log log){
        return logRepository.save(log);
    }

    public List<Log> getAllEntries(Integer pageNumber, Integer pageSize, String sortBy)
    {
        Pageable paging = PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.DESC, sortBy));
        Page<Log> pagedResult = logRepository.findAll(paging);
        if(pagedResult.hasContent()) {
            return pagedResult.getContent();
        } else {
            return new ArrayList<Log>();
        }
    }


}
