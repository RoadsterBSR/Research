var breezeQueryTracker = function ()
{

    var queries = [];

    function addQuery(queryToAdd)
    {
        queries.push(queryToAdd);
    }

    function removeQuery(queryToRemove)
    {
        //TODO: Implementation
        returnfalse;
    }

    function queryExists(query)
    {

        //check for existing query based on target entity and predicate
        var matchedQueries = new Array();
        matchedQueries = _.filter(queries, function (savedQuery)
        {
            return savedQuery.resultEntityType == query.resultEntityType &&
                    savedQuery.wherePredicate.toString() == query.wherePredicate.toString();
        });

        return matchedQueries.length > 0;
    }


    return {
        queries: queries,
        add: addQuery,
        //remove: removeQuery,
        exists: queryExists
    };
}

var queryTracker = new breezeQueryTracker();

//add query command to breeze
breeze.EntityManager.prototype.combinedQuery = function (query, targetTypeName, remoteOnly)
{
    var deferred = Q.defer();
    var results = null;
    var localQuery;

    //default value for parameters
    if (remoteOnly === null || remoteOnly === undefined)
    {
        remoteOnly = false;
    }

    try
    {
        if (!remoteOnly)
        {
            if (queryTracker.exists(query))
            {
                localQuery = query.toType(targetTypeName);
                //try local query
                results = this.executeQueryLocally(localQuery);
            }
        }
        //if it isn't in cache, results should be null
        if (results != null && results != undefined && results.length > 0)
        {
            deferredSuccess(results);
        }
        else//execute remote
        {
            queryTracker.add(query);
            this.executeQuery(query)
                .then(deferredSuccess)
                .fail(deferredFailure);
        }
    }
    catch (e)
    {
        deferredFailure(e);
    }


    function deferredSuccess(data)
    {
        var returnData;
        //if the data we went after was in a remote store, the return value has the associated query, entitymanager, and other objects.
        //however, we only want the data.results. 
        //if it was a local query then the incoming data will be all that we need.
        if (data.results === undefined)
        { returnData = data; }
        else
        { returnData = data.results; }

        deferred.resolve(returnData);
    }
    function deferredFailure(data)
    {
        deferred.reject(data);
    }

    return deferred.promise;
};