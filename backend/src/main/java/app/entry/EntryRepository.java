package app.entry;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
public interface EntryRepository extends PagingAndSortingRepository<Entry, Long>, JpaSpecificationExecutor<Entry> {

    @Query("SELECT e FROM entry e WHERE user_id = ?#{ principal?.name }")
    Page<Entry> getEntriesPage(Pageable pageable);

    @Query("SELECT e FROM entry e WHERE id = :id AND user_id = ?#{ principal?.name }")
    Entry findEntryById(@Param("id") long id);

    @Transactional
    @Modifying
    @Query("DELETE FROM entry e WHERE id = :id AND user_id = ?#{ principal?.name }")
    void  deleteEntry(@Param("id") long id);

    @Override
    <S extends Entry>S save(S entry);

}
