package app.log;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class LogService {

    @Autowired
    private LogRepository logRepository;

    public Log getLog(Long id){
        return logRepository.findById(id).orElse(null);
    }

    public Log addLog(Log log){
        return logRepository.save(log);
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
