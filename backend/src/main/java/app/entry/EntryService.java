package app.entry;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EntryService {

    private final Logger logger = LoggerFactory.getLogger(EntryService.class);

    @Autowired
    private EntryRepository entryRepository;

    public Entry getEntry(long id){
        logger.info("Getting entry with id: {}", id);
        return entryRepository.findEntryById(id);
    }

    public Entry addEntry(Entry entry){
        logger.info("Adding entry: {}", entry);
        return entryRepository.save(entry);
    }

    public void deleteEntry(long id){
        logger.info("Deleting entry with id: {}", id);
        entryRepository.deleteEntry(id);
    }

    public Entry updateEntry(Entry entry){
        logger.info("Updating entry: {}", entry);
        return entryRepository.save(entry);
    }

    public List<Entry> seachEntryPage(Specification<Entry> spec, Integer pageNumber, Integer pageSize, String sortBy) {
        Pageable paging = PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.DESC, sortBy));
        Page<Entry> pagedResult = entryRepository.findAll(spec, paging);
        if(pagedResult.hasContent()) {
            return pagedResult.getContent();
        } else {
            return new ArrayList<Entry>();
        }
    }

}
