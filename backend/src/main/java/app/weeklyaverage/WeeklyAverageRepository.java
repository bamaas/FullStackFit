package app.weeklyaverage;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import javax.persistence.OrderBy;
import java.util.List;

@Repository
public interface WeeklyAverageRepository extends CrudRepository<WeeklyAverage, Long> {

      @Query(value = "SELECT * FROM #{#entityName} WHERE year = ?1 AND week = ?2", nativeQuery = true)
      WeeklyAverage findByYearAndWeek(Short year, Byte week);

//      @Query(value = "SELECT stats FROM #{#entityName} stats WHERE year = :year AND week = :week AND user_id = ?#${ principal?.name }")
//      WeeklyAverage findByYearAndWeek(@Param("year") Short year, @Param("week") Byte week);

      @OrderBy("year, week")
      @Query(value = "SELECT stats FROM #{#entityName} stats WHERE user_id = ?#{ principal?.name } GROUP BY year, week, user_id ORDER BY year DESC, week DESC")
      List<WeeklyAverage> getAllSortedByYearAndWeek();

}
