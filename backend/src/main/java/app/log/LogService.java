package app.log;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class LogService {

    @Autowired
    private LogRepository logRepository;

    public List<Log> getAllLogEntries(){
        List<Log> entries = new ArrayList<>();
        logRepository.findAll().forEach(entries::add);
        return entries;
    }

    public Log getLog(Long id){
        return logRepository.findById(id).orElse(null);
    }

    public Map<String, Long> addLog(Log log){
        Log entry = logRepository.save(log);
        Map<String, Long> id = Map.of(
                "id", entry.getId()
        );
        return id;
    }

    public void deleteLog(long id){
        logRepository.deleteById(id);
    }
}
