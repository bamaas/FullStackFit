package app.log;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LogRepository extends PagingAndSortingRepository<Log, Long> {

//    TODO set precision in DAO to 1 decimal.
    @Query(value =
            "SELECT AVG(weight) AS avg_weight " +
            "FROM #{#entityName} " +
            "WHERE EXTRACT(YEAR FROM date) = ?1 " +
            "AND EXTRACT(WEEK FROM date) = ?2",
            nativeQuery = true)
    Float getAverageWeightByYearAndWeek(Short year, Byte week);

}
