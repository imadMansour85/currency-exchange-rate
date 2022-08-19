import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCurrencyPair } from './createPair.dto';
import { CurrencyPair } from './pair.entity';
import { exchangeBodyDto } from './exchangeBody.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(CurrencyPair) private readonly currencyRepository: Repository<CurrencyPair>,
  ) { }


  //add from-to currency pair
  async addPair(createCurrencyPair: CreateCurrencyPair) {
    try {

        let newPair;

        let pair = await this.currencyRepository.findOne({
          where: [{ from: createCurrencyPair.from, to: createCurrencyPair.to }, { from: createCurrencyPair.to, to: createCurrencyPair.from }]
        })
  
        //update or create if not found a pair Currency
        if (!pair) {
          newPair = await this.currencyRepository.create(createCurrencyPair);
          await this.currencyRepository.save(newPair);
          return { success: true, message: "pair created successfuly!" }
        }
        else {
          pair.from = createCurrencyPair.from
          pair.to = createCurrencyPair.to
          pair.rate = createCurrencyPair.rate
  
          await this.currencyRepository.save(pair);
          return { success: true, message: "pair updated successfuly!" }
        }

    } catch (error) {
      console.log(error.message);
      return { success: false, errorMsg: error.message }

    }
  }

  //BFS algorithme shortest path
  shortestPathBfs(graph, from, to) {
    try {

      let queue = [[(from), []]],
        seen = new Set;
      let path;
      while (queue.length) {
        //init queue BFS
        let [curVert, [...path], rate] = queue.shift();

        //init if undifined the rate for the first currency in the path
        rate = rate ? rate : 1
        path.push({ curVert, rate });

        //return path if we finish reading queue
        if (curVert === to) return path;
        if (!seen.has(curVert) && graph[curVert]) {

          queue.push(...graph[curVert].map(v => {
            //return destination currency with exchange rate
            return [v.to, path, v.rate]
          }));

        }
        seen.add(curVert);
      }
    } catch (error) {
      return error.message
    }
  }

  async convert(exchangeBodyDto: exchangeBodyDto) {
    try {
      let { from, to, amount } = exchangeBodyDto
      //get all currencyPairs with distinct to create graph easily
      let allCurrencies = await this.currencyRepository.createQueryBuilder('currency')
        .distinct(true)
        .select(['currency.from', 'currency.to', 'currency.rate'])
        .getRawMany();
  
      //graph creation  syntax {"EUR":["USD","CAD"]}
      let graph = allCurrencies.reduce((r, pair) => {
        r[pair.currency_from] = r[pair.currency_from] || [];
        r[pair.currency_to] = r[pair.currency_to] || [];
        r[pair.currency_from].push({ to: pair.currency_to, rate: pair.currency_rate });
        r[pair.currency_to].push({ to: pair.currency_from, rate: 1 / pair.currency_rate });
        return r;
      }, Object.create(null));
  
  
  
      if (this.shortestPathBfs(graph, from, to)) {
  
        let path = this.shortestPathBfs(graph, from, to)
        let exchangeRate = amount || 1
  
        //calculate the exchangeRate after looping the shortest path
        path.forEach(elm => {
          exchangeRate = elm.rate / exchangeRate
        });
  
        return { success: true, exchangeRate: exchangeRate }
      }
      else {
        return { success: false, message: "No data available" }
      }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }
}
