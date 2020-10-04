package app.weeklyaverage;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

@Repository
public interface WeeklyAverageRepository extends PagingAndSortingRepository<WeeklyAverage, Long> {

      @Query(value = "SELECT * FROM #{#entityName} WHERE year = ?1 AND week = ?2", nativeQuery = true)
      WeeklyAverage findByYearAndWeek(Short year, Byte week);

}
